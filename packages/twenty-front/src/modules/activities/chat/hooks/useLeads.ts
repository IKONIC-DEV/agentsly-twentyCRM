import { Lead } from '@/activities/chat/types/Lead';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';

export const useLeads = (targetableObject: ActivityTargetableObject) => {
  //   const targetableObjectFieldIdName = getActivityTargetObjectFieldIdName({
  //     nameSingular: targetableObject.targetObjectNameSingular,
  //   });

  const { records: leads, loading } = useFindManyRecords<Lead>({
    objectNameSingular: targetableObject.targetObjectNameSingular,
    filter: {
      id: {
        eq: targetableObject.id,
      },
    },
  });

  return {
    leads,
    loading,
  };
};
