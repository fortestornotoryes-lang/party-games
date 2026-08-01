import { MotiView } from 'moti';
import { cssInterop } from 'nativewind';

// NativeWind v4 не мапит className на style у сторонних компонентов —
// каждый используемый с className компонент регистрируется здесь.
// Файл импортируется один раз в app/_layout.tsx.
cssInterop(MotiView, { className: 'style' });
