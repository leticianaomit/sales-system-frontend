export interface TableColumn<T> {
  label?: string;
  property: keyof T;
  type: 'text';
  visible?: boolean;
  cssClasses?: string[];
}
