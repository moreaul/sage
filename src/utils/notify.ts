import {addToast} from "@heroui/react";
import {errorMessage} from "@/src/utils/search.ts";

export function notifySuccess(title: string) {
  addToast({title, color: "success", timeout: 2500});
}

export function notifyError(title: string, error: unknown) {
  console.error(title, error);
  addToast({title, description: errorMessage(error), color: "danger"});
}
