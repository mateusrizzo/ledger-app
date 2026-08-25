import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@theme';

export interface FilterDropdownOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  allLabel: string;
  options: FilterDropdownOption[];
  selectedValue: string | undefined;
  onChange: (value: string | undefined) => void;
}

interface SelectableOption {
  value: string | undefined;
  label: string;
}

export function FilterDropdown({
  allLabel,
  options,
  selectedValue,
  onChange,
}: FilterDropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === selectedValue);
  const displayLabel = selectedOption?.label ?? allLabel;
  const selectableOptions: SelectableOption[] = [{ value: undefined, label: allLabel }, ...options];

  function handleSelect(value: string | undefined) {
    onChange(value);
    setIsOpen(false);
  }

  return (
    <View style={[styles.container, isOpen ? styles.containerOpen : null]}>
      <TouchableOpacity
        style={[styles.trigger, selectedOption ? styles.triggerActive : null]}
        onPress={() => setIsOpen(previous => !previous)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`${allLabel} filter, currently ${displayLabel}`}>
        <Text
          style={[styles.triggerLabel, selectedOption ? styles.triggerLabelActive : null]}
          numberOfLines={1}>
          {displayLabel}
        </Text>
      </TouchableOpacity>
      {isOpen ? (
        <View style={styles.panel}>
          <ScrollView bounces={false} style={styles.panelScroll}>
            {selectableOptions.map(option => {
              const isSelected = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value ?? 'all'}
                  style={styles.option}
                  onPress={() => handleSelect(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}>
                  <Text style={[styles.optionLabel, isSelected ? styles.optionLabelSelected : null]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
  containerOpen: {
    zIndex: 20,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  triggerActive: {
    borderColor: theme.colors.text.link,
  },
  triggerLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  triggerLabelActive: {
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  panel: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: theme.spacing.xs,
    minWidth: 160,
    maxHeight: 240,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  panelScroll: {
    flexGrow: 0,
  },
  option: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  optionLabel: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  optionLabelSelected: {
    color: theme.colors.text.link,
    fontWeight: '600',
  },
});
