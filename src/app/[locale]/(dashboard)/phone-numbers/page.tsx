import PhoneNumbersPage from "./_components/phone-numbers-page";
import { GetPhoneNumbers } from "@/lib/api/phone-numbers.api";

export default async function Page() {
  const phoneNumbersData = await GetPhoneNumbers();
  return (
    <>
      <PhoneNumbersPage phoneNumbers={phoneNumbersData.phone_numbers} />
    </>
  );
}
