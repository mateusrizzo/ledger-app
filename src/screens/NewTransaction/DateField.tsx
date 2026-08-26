import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { theme } from '@theme';
import { formatDateFieldLabel } from '@utils/formatDateFieldLabel';

export interface DateFieldProps {
  value: string; // ISO
  onChange: (isoDate: string) => void;
}

export function DateField({ value, onChange }: DateFieldProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const label = formatDateFieldLabel(value);

  function handlePickerChange(_event: DateTimePickerEvent, selectedDate?: Date) {
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(previous => !previous)}
        accessibilityRole="button"
        accessibilityLabel={`Date, ${label}`}>
        <Text style={styles.triggerLabel}>{label}</Text>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.panel}>
          <DateTimePicker
            value={new Date(value)}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            onChange={handlePickerChange}
          />
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Done">
            <Text style={styles.doneLabel}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  trigger: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  triggerLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  panel: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  doneLabel: {
    ...theme.typography.cardAction,
    color: theme.colors.text.link,
  },
});
