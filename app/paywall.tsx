import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Check, Flower2, Sparkles, Bell, Palette } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useRevenueCat } from '@/providers/RevenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';

const features = [
  {
    icon: Sparkles,
    title: 'Full Dhammapada Library',
    description: '400+ authentic verses',
  },
  {
    icon: Bell,
    title: 'Unlimited Reminders',
    description: 'Stay present as often as you need',
  },
  {
    icon: Palette,
    title: 'Widget Themes',
    description: 'Customize your lock screen',
  },
  {
    icon: Flower2,
    title: 'Verse Bookmarking',
    description: 'Save your favorite teachings',
  },
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = Colors.light;
  
  const { 
    currentOffering, 
    isLoadingOfferings, 
    purchasePackage, 
    restorePurchases,
    isPurchasing, 
    isRestoring,
    isPremium
  } = useRevenueCat();

  const monthlyPackage = currentOffering?.availablePackages.find(
    pkg => pkg.identifier === 'monthly' || pkg.identifier === '$rc_monthly'
  );
  const yearlyPackage = currentOffering?.availablePackages.find(
    pkg => pkg.identifier === 'annual' || pkg.identifier === '$rc_annual'
  );

  const handlePurchase = async (pkg: PurchasesPackage | undefined) => {
    if (!pkg) {
      console.log('[Paywall] No package available');
      return;
    }

    console.log('[Paywall] Purchasing:', pkg.identifier);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await purchasePackage(pkg);
      console.log('[Paywall] Purchase successful');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      console.error('[Paywall] Purchase error:', errorMessage);
      if (!errorMessage.includes('cancelled') && !errorMessage.includes('PURCHASE_CANCELLED')) {
        Alert.alert('Purchase Failed', 'Please try again later.');
      }
    }
  };

  const handleRestore = async () => {
    console.log('[Paywall] Restoring purchases');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await restorePurchases();
      if (isPremium) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Restored', 'Your premium access has been restored.');
        router.replace('/');
      } else {
        Alert.alert('No Purchases', 'No previous purchases found.');
      }
    } catch (error) {
      console.error('[Paywall] Restore error:', error);
      Alert.alert('Restore Failed', 'Please try again later.');
    }
  };

  const handleSkip = () => {
    console.log('[Paywall] User skipped paywall');
    router.replace('/');
  };

  const formatPrice = (pkg: PurchasesPackage | undefined) => {
    if (!pkg) return '';
    return pkg.product.priceString;
  };

  const isLoading = isPurchasing || isRestoring;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={handleSkip}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <X size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.iconCircle, { backgroundColor: colors.backgroundSecondary }]}>
            <Flower2 size={48} color={colors.gold} strokeWidth={1.2} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Deepen Your{'\n'}Practice
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Unlock the complete path to mindfulness
          </Text>
        </View>

        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureRow, { borderBottomColor: colors.border }]}
            >
              <View style={[styles.featureIcon, { backgroundColor: colors.backgroundSecondary }]}>
                <feature.icon size={20} color={colors.gold} />
              </View>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textMuted }]}>
                  {feature.description}
                </Text>
              </View>
              <Check size={18} color={colors.accent} />
            </View>
          ))}
        </View>

        {isLoadingOfferings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              Loading plans...
            </Text>
          </View>
        ) : (
          <View style={styles.pricingSection}>
            <TouchableOpacity
              style={[styles.planCard, styles.planCardYearly, { backgroundColor: colors.text }]}
              onPress={() => handlePurchase(yearlyPackage)}
              activeOpacity={0.8}
              disabled={isLoading || !yearlyPackage}
            >
              <View style={[styles.bestValue, { backgroundColor: colors.gold }]}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
              <Text style={[styles.planTitle, { color: colors.background }]}>Yearly</Text>
              <View style={styles.planPriceRow}>
                <Text style={[styles.planPrice, { color: colors.background }]}>
                  {formatPrice(yearlyPackage) || '$19.99'}
                </Text>
                <Text style={[styles.planPeriod, { color: colors.background, opacity: 0.7 }]}>/year</Text>
              </View>
              <Text style={[styles.planSavings, { color: colors.gold }]}>
                Save 44% • $1.67/month
              </Text>
              {isPurchasing && (
                <ActivityIndicator 
                  style={styles.purchaseIndicator} 
                  size="small" 
                  color={colors.background} 
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handlePurchase(monthlyPackage)}
              activeOpacity={0.8}
              disabled={isLoading || !monthlyPackage}
            >
              <Text style={[styles.planTitle, { color: colors.text }]}>Monthly</Text>
              <View style={styles.planPriceRow}>
                <Text style={[styles.planPrice, { color: colors.text }]}>
                  {formatPrice(monthlyPackage) || '$2.99'}
                </Text>
                <Text style={[styles.planPeriod, { color: colors.textMuted }]}>/month</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} disabled={isLoading}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>
            Continue with Free
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.restoreButton} 
          onPress={handleRestore}
          disabled={isLoading}
        >
          <Text style={[styles.restoreText, { color: colors.textSecondary }]}>
            {isRestoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: colors.textMuted }]}>
          Cancel anytime • Auto-renews unless cancelled
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '300' as const,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
  },
  pricingSection: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  planCardYearly: {
    position: 'relative',
    overflow: 'hidden',
  },
  bestValue: {
    position: 'absolute',
    top: 12,
    right: -28,
    paddingHorizontal: 32,
    paddingVertical: 4,
    transform: [{ rotate: '45deg' }],
  },
  bestValueText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.background,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  planPeriod: {
    fontSize: 16,
    marginLeft: 4,
  },
  planSavings: {
    fontSize: 14,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  purchaseIndicator: {
    position: 'absolute',
    right: 20,
    top: '50%',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  restoreText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
