import { DateTime } from "luxon";
import { FC, useState } from "react";

type EditableValueType = string | number | DateTime | unknown;
export type ICustomEditorProps<T> = {
  value: T;
  onChange: (value: T) => void;
  onCancel: () => void;
};
export type IEditableValueProps<T extends EditableValueType> = {
  value: T;
  onChange: (value: T) => void;
  customRenderer?: (value: T) => string;
  customEditor?: FC<ICustomEditorProps<T>>;
  label?: string;
};

const isString = (value: EditableValueType): value is string => {
  return typeof value === "string";
};

const isNumber = (value: EditableValueType): value is number => {
  return typeof value === "number";
};

const isDateTime = (value: EditableValueType): value is DateTime => {
  return value instanceof DateTime;
};

export const EditableValue = <T extends EditableValueType>({
  value,
  onChange,
  customEditor,
  customRenderer,
  label,
}: IEditableValueProps<T>) => {
  const [editing, setEditing] = useState(false);

  const handleChange = (value: T) => {
    onChange(value);
    setEditing(false);
  };

  if (
    !isString(value) &&
    !isNumber(value) &&
    !isDateTime(value) &&
    !customRenderer
  ) {
    throw new Error(
      `EditableValue: customRenderer is required for unknown values (got ${typeof value})`,
    );
  }

  const displayValue = (() => {
    if (customRenderer) {
      return customRenderer(value);
    }
    if (isDateTime(value)) {
      return value.toISODate();
    }
    return `${value}`;
  })();
  return (
    <>
      {editing ? (
        <ValueEditor
          value={value}
          onChange={handleChange}
          onCancel={() => setEditing(false)}
          customEditor={customEditor}
        />
      ) : (
        <>
          <span>
            {label && <span>{label}: </span>}
            <span onClick={() => setEditing(true)}>{displayValue}</span>
          </span>
        </>
      )}
    </>
  );
};

type ValueEditorProps<T extends EditableValueType> = {
  value: T;
  onChange: (value: T) => void;
  onCancel: () => void;
  customEditor?: FC<ICustomEditorProps<T>>;
};

const ValueEditor = <T extends EditableValueType>({
  value,
  onChange,
  onCancel,
  customEditor,
}: ValueEditorProps<T>) => {
  const [localValue, setLocalValue] = useState(value);
  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onCancel();
    }
    if (e.key === "Enter") {
      onChange(localValue);
    }
  };

  const onBlur = () => {
    onChange(localValue);
  };

  if (customEditor) {
    return customEditor({ value, onChange, onCancel });
  }
  if (isString(localValue)) {
    return (
      <input
        autoFocus
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value as T)}
      />
    );
  }
  if (isNumber(localValue)) {
    return (
      <input
        autoFocus
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(parseInt(e.target.value) as T)}
      />
    );
  }
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = DateTime.fromISO(e.target.value);
    setLocalValue(date as T);
  };
  if (isDateTime(localValue)) {
    return (
      <input
        autoFocus
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        type="date"
        value={localValue.toISODate() ?? ""}
        onChange={onDateChange}
      />
    );
  }
  return null;
};
