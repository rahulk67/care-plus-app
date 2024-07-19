"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import "react-phone-number-input/style.css";

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneinput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datepicker",
    SELECT = "select",
    SKELETON = "skeleton"
}




const PatientForm = () => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);


    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",

        },
    })

    // 2. Define a submit handler.
    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            const userData = { name, email, phone };

            const user = await createUser(userData);

            if (user) {
                router.push(`/patients/${user.$id}/register`)
            }
                
            

        } catch (error) {
            console.log(error);


        }
        setIsLoading(false);

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hii there !!</h1>
                    <p className="text-dark-700">Schedule your first appointment</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="JohnDoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />


                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="(+91) 123-4567-890"
                />


                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>


            </form>
        </Form>
    )
}


export default PatientForm