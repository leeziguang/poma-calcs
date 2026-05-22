import React, { useEffect, useRef, useState } from "react";
import { runInAction } from "mobx";
import { Form, Spin, notification } from "antd";
import { EPairListFormFields } from "src/types";
import { PairListBody } from "src/components/pair-list-body";
import { genTrainerOptionList } from "./helpers";
import { trainerStore } from "src/store/trainer";
import { monsterStore } from "src/store/monster";
import { moveStore } from "src/store/move";
import { passiveStore } from "src/store/passive";
import { sessionStore } from "src/store/session";
import { ISavedSession } from "src/types/session";

const PokemonList = ({
  pendingSession
}: {
  pendingSession: ISavedSession | null;
}) => {
  const [form] = Form.useForm();
  const autoSaveFnRef = useRef<(() => void) | null>(null);

  return (
    <Form
      colon={false}
      layout="vertical"
      className="form"
      form={form}
      onValuesChange={() => autoSaveFnRef.current?.()}
    >
      <Form.List name={EPairListFormFields.PAIR}>
        {(fields, { add, remove }) => (
          <PairListBody
            fields={fields}
            add={add}
            remove={remove}
            autoSaveFnRef={autoSaveFnRef}
            pendingSession={pendingSession}
          />
        )}
      </Form.List>
    </Form>
  );
};

export const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSession, setPendingSession] = useState<ISavedSession | null>(
    null
  );

  useEffect(() => {
    sessionStore.loadFromStorage();
    sessionStore.setOnQuotaError(() => {
      notification.error({
        message: "Storage full — delete saved sessions to free space"
      });
    });

    Promise.all([
      trainerStore.initApiCalls(),
      monsterStore.initApiCalls(),
      moveStore.initApiCalls(),
      passiveStore.initApiCalls()
    ])
      .then(() => {
        runInAction(() => genTrainerOptionList());
      })
      .finally(() => {
        const { session, corrupt } = sessionStore.readAutoSave();
        if (session) {
          setPendingSession(session);
        } else if (corrupt) {
          notification.warning({ message: "Could not restore last session" });
        }
        setIsLoading(false);
      });

    return () => {
      trainerStore.reset();
      monsterStore.reset();
      moveStore.reset();
      passiveStore.reset();
    };
  }, []);

  return (
    <div>
      <b>Poma Calcs</b>
      <Spin spinning={isLoading}>
        <PokemonList pendingSession={pendingSession} />
      </Spin>
    </div>
  );
};
