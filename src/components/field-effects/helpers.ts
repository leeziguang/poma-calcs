import {
  EFieldEffectFormFields,
  ICalcFieldEffectArg
} from "src/types/field-effect";

export const calcFieldEffect = ({
  syncBoosts,
  wtz,
  circle,
  rebuff,
  seun
}: ICalcFieldEffectArg) => {
  console.log("calcFieldEffect", syncBoosts, wtz, circle, rebuff, seun);
  const totalCircleMulti = (circle || []).reduce(
    (acc, c) =>
      acc +
      c[EFieldEffectFormFields.CIRCLE_MULTI] *
        (1 + c[EFieldEffectFormFields.MEMBERS]),
    1
  );

  return (
    (1 + syncBoosts * 0.5) *
    wtz *
    totalCircleMulti *
    rebuff *
    //
    // SEUN raises super-effective modifier from 2 to 3,
    // but if not super-effective to begin with, should be 1
    (seun ? 3 : 1)
  );
};
