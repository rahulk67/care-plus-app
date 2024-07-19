import AppointmentForm from "@/components/forms/AppointmentForm";
import PatientForm from "@/components/forms/PatientForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";


export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/care-plus.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id} 
               />


          <p className="copyright mt-10 py-12"> © 2024 CarePlus </p>


          {/* <div className="text-14-regular m-20 flex justify-between">
         <Link href="/?admin=true" className="text-green-500">Admin</Link>
        </div> */}

        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.jpg"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>

  );
}
