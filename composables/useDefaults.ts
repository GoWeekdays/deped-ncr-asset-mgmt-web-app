export default function useDefaults() {
  const entityName = ref("DEPED NCR");
  const fundCluster = ref("M003");

  return {
    entityName,
    fundCluster,
  };
}
