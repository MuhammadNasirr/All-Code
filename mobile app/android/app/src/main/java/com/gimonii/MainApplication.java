package com.gimonii;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.lottie.LottiePackage;
import com.horcrux.svg.SvgPackage;

import com.imagepicker.ImagePickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LottiePackage(),
            new SvgPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new StripeReactPackage(),
            new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
          new SplashScreenReactPackage(),
          new LinearGradientPackage(),
          new RNGeocoderPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
