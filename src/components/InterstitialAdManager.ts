import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-6741963315615698/3595068915';
const ELIGIBLE_ACTIONS_PER_AD = 3;

type AdSubscription = (() => void) | {remove: () => void};
type AdError = {code?: string; message?: string};

class InterstitialAdManager {
  private ad: InterstitialAd | null = null;
  private subscriptions: AdSubscription[] = [];
  private eligibleActionCount = 0;
  private isLoaded = false;
  private isLoading = false;
  private isShowing = false;
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;
    this.preload();
  }

  recordEligibleNavigation() {
    this.eligibleActionCount += 1;

    if (this.eligibleActionCount < ELIGIBLE_ACTIONS_PER_AD) {
      return;
    }

    this.eligibleActionCount = 0;
    this.showIfAvailable();
  }

  dispose() {
    this.removeListeners();
    this.ad?.destroy();
    this.ad = null;
    this.isInitialized = false;
    this.isLoaded = false;
    this.isLoading = false;
    this.isShowing = false;
  }

  private preload() {
    if (!this.isInitialized || this.isLoading || this.isLoaded || this.isShowing) {
      return;
    }

    this.isLoading = true;
    this.removeListeners();
    this.ad = InterstitialAd.createForAdRequest(
      __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_ID,
    );

    this.subscriptions = [
      this.ad.addAdEventListener(AdEventType.LOADED, () => {
        this.isLoading = false;
        this.isLoaded = true;
        console.log('Interstitial ad loaded.');
      }),
      this.ad.addAdEventListener(AdEventType.CLOSED, () => {
        this.isShowing = false;
        this.isLoaded = false;
        this.removeListeners();
        this.ad?.destroy();
        this.ad = null;
        this.preload();
      }),
      this.ad.addAdEventListener(AdEventType.ERROR, (error: AdError) => {
        this.isLoading = false;
        this.isLoaded = false;
        console.warn(
          `Interstitial ad failed (code: ${error.code ?? 'unknown'}, message: ${
            error.message ?? 'unknown'
          })`,
        );
        this.removeListeners();
        this.ad?.destroy();
        this.ad = null;
        this.preload();
      }),
    ];

    try {
      this.ad.load();
    } catch (error) {
      this.isLoading = false;
      console.error('Interstitial ad could not start loading:', error);
      this.removeListeners();
      this.ad?.destroy();
      this.ad = null;
    }
  }

  private showIfAvailable() {
    if (!this.ad || !this.isLoaded || this.isShowing) {
      return;
    }

    this.isShowing = true;
    this.isLoaded = false;

    this.ad.show().catch((error: AdError) => {
      this.isShowing = false;
      console.warn(
        `Interstitial ad could not be shown (code: ${error.code ?? 'unknown'}, message: ${
          error.message ?? 'unknown'
        })`,
      );
      this.removeListeners();
      this.ad?.destroy();
      this.ad = null;
      this.preload();
    });
  }

  private removeListeners() {
    this.subscriptions.forEach(subscription => {
      if (typeof subscription === 'function') {
        subscription();
      } else {
        subscription.remove();
      }
    });
    this.subscriptions = [];
  }
}

export default new InterstitialAdManager();
