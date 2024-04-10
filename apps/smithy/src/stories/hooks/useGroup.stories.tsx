import { useGroup } from "@frigade/react";
import { useEffect, useState } from "react";

export default {
  title: "Hooks/useGroup",
};

export function Default() {
  const { addProperties, setGroupId } = useGroup();
  const [hasSetProps, setHasSetProps] = useState(false);
  useEffect(() => {
    async function setProps() {
      await setGroupId("group_12345");
      await addProperties({
        orgPicture: "https://placehold.co/24x24",
      });
      setHasSetProps(true);
    }

    setProps();
  }, []);

  return (
    <div>
      <div id="">
        hasSuccessFullySentPropsToFrigadeAPI: {hasSetProps ? "true" : "false"}
      </div>
    </div>
  );
}
