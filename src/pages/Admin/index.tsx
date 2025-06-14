import React from "react";

import Admin from "../../modules/admin";
import { FormConfig } from "../../global.types";

interface AdminPageProps {
  setFormConfig: React.Dispatch<React.SetStateAction<FormConfig>>;
  formConfig: FormConfig;
}

const AdminPage = ({ setFormConfig, formConfig }: AdminPageProps) => {
  return (
    <div>
      <Admin formConfig={formConfig} setFormConfig={setFormConfig} />
    </div>
  );
};

export default AdminPage;
