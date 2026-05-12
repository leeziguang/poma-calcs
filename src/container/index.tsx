import React, { useState } from "react";
import { DataColList } from "../components/data-col-list";
import { Button, Form, Input } from "antd";
import { EPairListFormFields } from "src/types";
import "./style.scss";

export const MainPage = () => {
  const PokemonList = () => {
    const [pairName, setPairName] = useState<string>("TEST PAIR 11037");
    const [pairNames, setPairNames] = useState<string[]>([]);

    return (
      <Form colon={false} layout="vertical" className="form">
        <Form.List name={EPairListFormFields.PAIR}>
          {(fields, { add, remove }) => (
            <>
              <div>
                <Input
                  value={pairName}
                  onChange={e => setPairName(e.target.value)}
                />
                <Button
                  onClick={() => {
                    add();
                    setPairNames(prev => [...prev, pairName]);
                    setPairName(undefined);
                  }}
                >
                  Add Pair
                </Button>
              </div>

              {fields?.map(field => (
                <div key={field.key}>
                  <DataColList
                    fieldName={field.name}
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
      Poma Calcs
      <PokemonList />
    </div>
  );
};
