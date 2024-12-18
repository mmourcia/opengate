import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ActionTileProps {
  title: string;
  icon: string;
  status?: boolean;
  onPress: () => void;
}

const ActionTile = ({ title, icon, status, onPress }: ActionTileProps) => {
  const backgroundColor = status === undefined 
    ? 'white' 
    : status 
      ? '#4CD964' // Green for success
      : '#FF3B30'; // Red for failure

  const textColor = status === undefined ? '#333' : 'white';

  return (
    <TouchableOpacity 
      style={[styles.tile, { backgroundColor }]} 
      onPress={onPress}
    >
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Icon name="play-circle" size={30} color={textColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 10,
    margin: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default ActionTile; 