import React, { useState } from "react";
import { DataColList } from "../components/data-col-list";
import { Button, Form } from "antd";
import { EPairListFormFields } from "src/types";
import { ActionTopbar } from "src/components/action-topbar";
import "./style.scss";

export const MainPage = () => {
  const PokemonList = () => {
    const [form] = Form.useForm();
    const [pairName, setPairName] = useState<string>(undefined);
    const [pairNames, setPairNames] = useState<string[]>([]);

    return (
      <Form
        colon={false}
        layout="vertical"
        className="form"
        onValuesChange={(_, values) => console.log(values)}
        form={form}
      >
        <Form.List name={EPairListFormFields.PAIR}>
          {(fields, { add, remove }) => (
            <>
              <ActionTopbar
                add={add}
                pairName={pairName}
                setPairName={setPairName}
                setPairNames={setPairNames}
              />

              {fields?.map(field => (
                <div key={field.key}>
                  <DataColList
                    pairFieldName={field.name}
                    title={pairNames[field.name]}
                    onTitleChange={val =>
                      setPairNames(prev =>
                        prev.map((n, i) => (i === field.name ? val : n))
                      )
                    }
                  />
                  <Button
                    onClick={() => {
                      remove(field.name);
                      setPairNames(prev =>
                        prev.filter((_, i) => i !== field.name)
                      );
                    }}
                  >
                    Delete Pair
                  </Button>
                </div>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    );
  };

  return (
    <div>
      <b>Poma Calcs</b>
      <PokemonList />
    </div>
  );
};
