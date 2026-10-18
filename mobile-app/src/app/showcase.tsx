import { Play, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PlayerRow } from '@/entities/player/components/PlayerRow';
import { PlayerScoreList } from '@/entities/player/components/PlayerScoreList';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import { MemoCardView } from '@/games/MemoRiskGame/components/MemoCardView';
import { MemoCardState, MemoRarity, MemoShape, type MemoCard } from '@/games/MemoRiskGame/types';
import { Badge } from '@/shared/components/Badge';
import { GameCard } from '@/shared/components/GameCard';
import { GameHeader } from '@/shared/components/GameHeader';
import { GlassCard } from '@/shared/components/GlassCard';
import { IconButton } from '@/shared/components/IconButton';
import { InstructionsModal } from '@/shared/components/InstructionsModal';
import { Pagination } from '@/shared/components/Pagination';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { PlayingHeader } from '@/shared/components/PlayingHeader';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { StopGameButton } from '@/shared/components/StopGameButton';
import { TabButton } from '@/shared/components/TabButton';
import { TextInput } from '@/shared/components/TextInput';
import { TimerBar } from '@/shared/components/TimerBar';
import { Typography } from '@/shared/components/Typography';
import { getTheme, PREMIUM_RGB, rgba } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

/** Заглушка для декоративных обработчиков витрины — компоненты здесь не выполняют реальных действий */
const noop = () => {
  /* демо-заглушка */
};

/** Демо-карты MemoRisk: по одной каждой редкости + супер + опасная — для витрины состояний */
const DEMO_RARITIES = [MemoRarity.Common, MemoRarity.Uncommon, MemoRarity.Rare, MemoRarity.Epic];
const makeDemoCard = (id: number, rarity: MemoRarity, isSuper = false): MemoCard => ({
  id,
  shape: MemoShape.Star,
  rarity,
  isSuper,
  state: MemoCardState.Hidden,
});

const ALL_THEMES = Object.keys(PREMIUM_RGB) as GameTheme[];

/** Темы, у которых есть акцент PassPhoneCard/PlayerScoreList (подмножество GameTheme) */
const ACCENTED = ['red', 'orange', 'sky', 'green', 'purple', 'yellow'] as const;

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View className="mb-8">
    <SectionLabel>{title}</SectionLabel>
    {children}
  </View>
);

/**
 * Debug-витрина UI-кита (аналог storybook): все компоненты во всех 12 темах.
 * Критерий готовности этапа 2 плана миграции.
 */
export default function ShowcaseScreen() {
  const insets = useSafeAreaInsets();
  const [theme, setTheme] = useState<GameTheme>('red');
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const [name, setName] = useState('Дуня');
  const [modalOpen, setModalOpen] = useState(false);
  const [flowKey, setFlowKey] = useState(0);
  const [demoCards, setDemoCards] = useState<MemoCard[]>(() => [
    ...DEMO_RARITIES.map((r, i) => makeDemoCard(i, r)),
    makeDemoCard(10, MemoRarity.Rare, true),
    makeDemoCard(11, MemoRarity.Common),
  ]);
  const isDanger = (i: number) => i === demoCards.length - 1;
  const tokens = getTheme(theme);
  const accent = (ACCENTED as readonly string[]).includes(theme)
    ? (theme as (typeof ACCENTED)[number])
    : 'red';

  return (
    <View className="flex-1">
      <GameHeader
        title="Showcase"
        subtitle="UI kit · 12 themes"
        icon={Play}
        theme={theme}
        onBack={noop}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 48 }}
      >
        {/* Переключатель темы */}
        <Section title="Тема">
          <View className="flex-row flex-wrap gap-2">
            {ALL_THEMES.map((c) => (
              <Pressable
                key={c}
                onPress={() => {
                  setTheme(c);
                }}
                className={`rounded-premium-sm border px-3 py-2 ${
                  c === theme ? getTheme(c).bg20 + ' ' + getTheme(c).border40 : 'border-white/10'
                }`}
              >
                <Text className="text-xs font-black uppercase" style={{ color: rgba(c, 1) }}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Typography">
          <View className="gap-2">
            <Typography.Display size="sm" color={ACCENTED.includes(accent) ? accent : 'red'} glow>
              Дуня
            </Typography.Display>
            <Typography.Title>Заголовок</Typography.Title>
            <Typography.Heading>Подзаголовок</Typography.Heading>
            <Typography.Label>Метка · Лидер миссии</Typography.Label>
            <Typography.Body>
              Обычный текст инструкции — читаемый, со сносным межстрочным интервалом.
            </Typography.Body>
            <Typography.Caption>Минимальный хинт</Typography.Caption>
            <Typography.Score glow color="yellow">
              42
            </Typography.Score>
          </View>
        </Section>

        <Section title="Buttons">
          <View className="gap-3">
            <PrimaryButton variant="premium" icon={Play} onClick={noop}>
              Играть
            </PrimaryButton>
            <PrimaryButton variant="white" onClick={noop}>
              Белая
            </PrimaryButton>
            <PrimaryButton variant="red" onClick={noop}>
              Красная
            </PrimaryButton>
            <PrimaryButton variant="outline" onClick={noop}>
              Outline
            </PrimaryButton>
            <PrimaryButton variant="emerald" disabled onClick={noop}>
              Disabled
            </PrimaryButton>
            <View className="flex-row gap-3">
              <IconButton variant="filled" icon={Play} onClick={noop} />
              <IconButton variant="ghost" icon={Users} onClick={noop} />
              <IconButton variant="danger" icon={Play} onClick={noop} />
            </View>
            <StopGameButton onClick={noop} />
          </View>
        </Section>

        <Section title="Tabs / Badges / Dots / Pagination">
          <View className="mb-4 flex-row">
            <TabButton active={tab === 0} onClick={() => { setTab(0); }}>
              Общие
            </TabButton>
            <TabButton active={tab === 1} onClick={() => { setTab(1); }}>
              Слова
            </TabButton>
          </View>
          <View className="mb-4 flex-row gap-2">
            <Badge variant="default">Новый раунд</Badge>
            <Badge variant="outline">6+ игроков</Badge>
          </View>
          <ProgressDots count={5} current={2} activeColor={tokens.solid} className="mb-4" />
          <Pagination page={page} total={30} perPage={10} onChange={setPage} />
        </Section>

        <Section title="Inputs / Timer">
          <TextInput value={name} onChangeText={setName} placeholder="Имя игрока" />
          <View className="mt-4">
            <PlayingHeader explainer="Валера" timeLeft={37} timerColor={rgba(theme, 1)} />
            <TimerBar pct={62} color={rgba(theme, 1)} className="mt-2 rounded-full" />
          </View>
        </Section>

        <Section title="Cards">
          <GameCard title="Стеклянная карточка" className="mb-4">
            <Typography.Body>Контент внутри GameCard (GlassCard + SectionLabel).</Typography.Body>
          </GameCard>
          <GlassCard className="rounded-premium-lg mb-4 p-4">
            <Typography.Body>Голый GlassCard без заголовка.</Typography.Body>
          </GlassCard>
          <PassPhoneCard
            playerName={name || 'Дуня'}
            playerLabel="Передай телефон"
            badge="Раунд 2"
            badgeColor={accent}
            instruction="Нажми, когда телефон у тебя"
            icon={Users}
            accentColor={accent}
            onClick={noop}
          />
        </Section>

        <Section title="Players">
          <View className="mb-4 gap-3">
            <PlayerRow
              player={{ id: '1', name }}
              index={0}
              canRemove
              config={tokens}
              theme={theme}
              placeholder="Игрок"
              onRemove={noop}
              onChange={(_, n) => {
                setName(n);
              }}
            />
          </View>
          <PlayerScoreList
            players={['Дуня', 'Валера', 'Диана']}
            scores={{ Дуня: 5, Валера: 3, Диана: 7 }}
            activePlayer="Дуня"
            activeLabel="объясняет"
            accentColor={accent}
            className="mb-4"
          />
          <LeaderboardList
            players={['Дуня', 'Валера', 'Диана']}
            scores={{ Дуня: 5, Валера: 3, Диана: 7 }}
          />
        </Section>

        <Section title="Раздача ролей (PassPhoneCard + DistributionFlow)">
          <Typography.Caption className="mb-3">
            Живой прогон: locked → revealed → следующий игрок. Тестирует ту самую анимацию
            смены карточки.
          </Typography.Caption>
          <View className="h-[420px]">
            <DistributionFlow
              key={flowKey}
              players={[
                { id: '1', name: 'Дуня', role: 'Демо-роль', isSpy: false },
                { id: '2', name: 'Валера', role: 'Демо-роль', isSpy: false },
                { id: '3', name: 'Диана', role: 'Демо-роль', isSpy: true },
              ]}
              onFinish={() => {
                setFlowKey((k) => k + 1);
              }}
              passInstruction="Нажми, когда телефон у тебя"
              passIcon={Users}
              passAccentColor={accent}
              activeColor={tokens.solid}
              renderCard={(player, isLast, onNext) => (
                <GameCard title={`Роль: ${player.name}`}>
                  <Typography.Body className="mb-4">
                    Демо-контент карточки роли — сюда игра подставляет своё содержимое.
                  </Typography.Body>
                  <PrimaryButton variant="premium" onClick={onNext}>
                    {isLast ? 'Завершить' : 'Далее'}
                  </PrimaryButton>
                </GameCard>
              )}
            />
          </View>
        </Section>

        <Section title="MemoRisk — карты во всех состояниях">
          <Typography.Caption className="mb-3">
            Тапни закрытую карту — проверка 3D-флипа (как в игре, назад не переворачивается).
            Последняя карта — с «опасной» подсветкой после открытия.
          </Typography.Caption>
          <PrimaryButton
            variant="outline"
            className="mb-3"
            onClick={() => {
              setDemoCards((cards) => cards.map((c) => ({ ...c, state: MemoCardState.Hidden })));
            }}
          >
            Сбросить карты
          </PrimaryButton>
          <View className="flex-row flex-wrap gap-3">
            {demoCards.map((card, i) => (
              <View key={card.id} className="w-[30%]">
                <MemoCardView
                  card={card}
                  slot={i}
                  isDangerRevealed={isDanger(i) && card.state !== MemoCardState.Hidden}
                  disabled={false}
                  onFlip={() => {
                    setDemoCards((cards) =>
                      cards.map((c, idx) =>
                        idx === i
                          ? {
                              ...c,
                              state:
                                c.state === MemoCardState.Hidden
                                  ? MemoCardState.Revealed
                                  : MemoCardState.Hidden,
                            }
                          : c,
                      ),
                    );
                  }}
                />
              </View>
            ))}
          </View>
        </Section>

        <PrimaryButton
          variant="premium"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Открыть инструкции
        </PrimaryButton>
      </ScrollView>

      <InstructionsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        title="Инструкции"
        theme={theme}
        description="Пример модалки с правилами игры."
        instructions={[
          { title: 'Шаг 1', content: 'Соберите игроков в круг.' },
          { title: 'Шаг 2', content: 'Передавайте телефон по очереди.' },
        ]}
      />
    </View>
  );
}
