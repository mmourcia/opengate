# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.swmansion.reanimated.** { *; }

# BLE Manager
-keep class com.facebook.react.modules.blob.** { *; }
-keep class com.facebook.react.modules.network.** { *; }
-keep class com.facebook.react.modules.storage.** { *; }
-keep class com.facebook.react.bridge.** { *; }

# Keep your custom classes
-keep class com.opengate.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep your action executor classes
-keep class com.opengate.services.** { *; }
-keepclassmembers class com.opengate.services.** { *; }

# Keep JSON-related classes
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
