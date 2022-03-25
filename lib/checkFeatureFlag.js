import store from 'store2';

const checkFeatureFlag = (featureFlag) => {
  const profile = store.namespace("user")("profile");

  const { featureFlags } = profile?.info || {};
  if (!featureFlags) return false;

  return featureFlags[featureFlag]
}

export default checkFeatureFlag;