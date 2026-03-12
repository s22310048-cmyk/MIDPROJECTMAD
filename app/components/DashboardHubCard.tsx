import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DashboardHubCardProps {
  href: Href;
  label: string;
  icon: string;
  color?: string;
}

export default function DashboardHubCard({ href, label, icon, color = '#007AFF' }: DashboardHubCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Link href={href} asChild>
      <TouchableOpacity style={[styles.card, { backgroundColor: isDark ? '#2A2A2E' : '#F8F9FA' }]}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={40} color={color} />
        </View>
        <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#000000' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    margin: 8,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

