# GlideUI ✦

> Animated React Native components for Expo. Copy-paste or install. Dark mode first.

**[glideui.dev](https://glideui.dev)** · [Components](https://glideui.dev/components) · MIT License

---

## Install

```bash
npm install glideui-core
# or
bun add glideui-core
# or
yarn add glideui-core
```

## Usage

```tsx
import { Button, Badge, Card, Input, Avatar, Skeleton } from 'glideui-core';

export default function App() {
  return (
    <Card>
      <Avatar name="John Doe" status="online" />
      <Input label="Email" placeholder="your@email.com" />
      <Button onPress={() => console.log('pressed!')}>
        Get started
      </Button>
      <Badge variant="success" dot>Active</Badge>
    </Card>
  );
}
```

## Components

### Free (19 components)
- **Core:** Button, Badge, Avatar, Card, Separator
- **Form:** Input, Textarea, Switch, Checkbox, Radio, Select
- **Feedback:** Toast, Skeleton, Progress, Modal, BottomSheet
- **Navigation:** TabBar, Tabs, Accordion

### Pro (5 components)
- OTP Input, Date Picker, Swipeable Card, Data Table, Charts

## Copy-paste model

Don't want the package? Copy components directly:

```bash
npx glide-ui add button
npx glide-ui add input
npx glide-ui add all
```

Files are copied to `components/ui/` in your project. You own the code.

## Requirements

- React Native ≥ 0.73
- Expo ≥ 50
- React ≥ 18
- TypeScript recommended

## License

MIT © Nitesh Nagpal
