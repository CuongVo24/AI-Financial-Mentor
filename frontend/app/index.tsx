import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Split, MoreHorizontal, Lock } from 'lucide-react-native';
import { Transaction, TransactionType, PrivacyLevel } from '../src/types';

// Mock Data matches the Backend Contract
const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 50000,
    type: TransactionType.EXPENSE,
    category: 'Coffee',
    note: 'Morning boost ☕️',
    party: 'Highlands Coffee',
    date: new Date().toISOString(),
    privacyLevel: PrivacyLevel.PUBLIC,
    isGroupPotential: false,
  },
  {
    id: '2',
    amount: 150000,
    type: TransactionType.EXPENSE,
    category: 'Food',
    note: 'Secret lunch',
    party: 'Pizza 4P\'s',
    date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    privacyLevel: PrivacyLevel.MASKED,
    isGroupPotential: false,
  },
  {
    id: '3',
    amount: 850000,
    type: TransactionType.EXPENSE,
    category: 'Entertainment',
    note: 'Karaoke night with the gang 🎤',
    party: 'ICool Karaoke',
    date: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    privacyLevel: PrivacyLevel.PUBLIC,
    isGroupPotential: true,
  },
];

const SocialCard = ({ item }: { item: Transaction }) => {
  const isMasked = item.privacyLevel === PrivacyLevel.MASKED;
  const isPublic = item.privacyLevel === PrivacyLevel.PUBLIC;

  // Format amount
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(item.amount);

  return (
    <View className="bg-white mx-4 my-3 p-5 rounded-[24px] shadow-sm border border-gray-100">
      {/* Header: User & Party */}
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden border-2 border-white shadow-sm">
          <Image
            source={{ uri: `https://picsum.photos/seed/${item.id}/200` }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-base">
            Minh <Text className="font-normal text-gray-500">spent at</Text> {item.party}
          </Text>
          <Text className="text-gray-400 text-xs font-medium">
            {new Date(item.date || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <TouchableOpacity className="p-2">
          <MoreHorizontal color="#D1D5DB" size={20} />
        </TouchableOpacity>
      </View>

      {/* Main Content: Amount & Note */}
      <View className="bg-gray-50 p-4 rounded-2xl mb-4">
        {isMasked ? (
          <View className="flex-row items-center">
            <Text className="text-gray-400 font-bold text-2xl italic">🙈 Secret</Text>
          </View>
        ) : (
          <Text className="text-[#D82D8B] font-black text-3xl">
            -{formattedAmount}
          </Text>
        )}

        <Text className="text-gray-700 mt-2 font-medium text-base leading-5">
          {item.note || item.category}
        </Text>
      </View>

      {/* Social Action Bar */}
      <View className="flex-row items-center justify-between pl-1 pr-1">
        <View className="flex-row gap-6">
          <TouchableOpacity className="flex-row items-center gap-1.5">
            <Heart color={isPublic ? "#EF4444" : "#9CA3AF"} size={24} strokeWidth={2.5} />
            {isPublic && <Text className="text-gray-600 font-bold text-sm">12</Text>}
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1.5">
            <MessageCircle color="#6B7280" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Ghost Splitting Trigger - Only if isGroupPotential */}
        {item.isGroupPotential && (
          <TouchableOpacity className="flex-row items-center bg-[#FDF2F8] px-4 py-2 rounded-full border border-pink-100">
            <Split color="#D82D8B" size={16} strokeWidth={3} />
            <Text className="text-[#D82D8B] font-bold text-xs ml-2 uppercase tracking-wide">Split Bill</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function FeedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top']}>
      <View className="px-5 pt-2 pb-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <Text className="text-2xl font-black text-gray-900 tracking-tighter">
          Money<Text className="text-[#D82D8B]">Locket</Text>
        </Text>
        <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
          <Lock size={14} color="#374151" />
        </View>
      </View>

      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => <SocialCard item={item} />}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}