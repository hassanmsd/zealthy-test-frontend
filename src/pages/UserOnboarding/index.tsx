import { FormConfig } from "../../global.types";
import UserOnboarding from "../../modules/userOnboarding";

interface UseronboardingPageProps {
  formConfig: FormConfig;
}

const UserOnboardingPage = ({ formConfig }: UseronboardingPageProps) => {
  return (
    <div>
      <UserOnboarding formConfig={formConfig} />
    </div>
  );
};

export default UserOnboardingPage;
