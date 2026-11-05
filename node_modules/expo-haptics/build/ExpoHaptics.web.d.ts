import { NotificationFeedbackType, ImpactFeedbackStyle } from './Haptics.types';
declare const _default: {
    notificationAsync(type: NotificationFeedbackType): Promise<void>;
    impactAsync(style: ImpactFeedbackStyle): Promise<void>;
    selectionAsync(): Promise<void>;
};
export default _default;
