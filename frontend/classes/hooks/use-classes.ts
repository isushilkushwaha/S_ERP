import {
  useClasses,
  useClass,
} from "../api/classes.query";

import type { ClassQuery } from "../types/class";

export function useClassesData(
  params?: ClassQuery
) {
  return useClasses(params);
}

export function useClassData(
  id?: string
) {
  return useClass(id);
}

export {
  useClasses,
  useClass,
};