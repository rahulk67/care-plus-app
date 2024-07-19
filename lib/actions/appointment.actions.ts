"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
    appointment: CreateAppointmentParams
) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment)

    } catch (error) {
        console.error("An error occurred while creating a new appointment:", error);
    }
};



export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        );

        return parseStringify(appointment);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the existing patient:",
            error
        );
    }
};


export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        );

        // const scheduledAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "scheduled");

        // const pendingAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "pending");

        // const cancelledAppointments = (
        //   appointments.documents as Appointment[]
        // ).filter((appointment) => appointment.status === "cancelled");

        // const data = {
        //   totalCount: appointments.total,
        //   scheduledCount: scheduledAppointments.length,
        //   pendingCount: pendingAppointments.length,
        //   cancelledCount: cancelledAppointments.length,
        //   documents: appointments.documents,
        // };

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "scheduled":
                        acc.scheduledCount++;
                        break;
                    case "pending":
                        acc.pendingCount++;
                        break;
                    case "cancelled":
                        acc.cancelledCount++;
                        break;
                }
                return acc;
            },
            initialCounts
        );

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        };

        return parseStringify(data);
    } catch (error) {
        console.error(
            "An error occurred while retrieving the recent appointments:",
            error
        );
    }
};



export const updateAppointment = async ({
    appointmentId,
    userId, 
    appointment,
    type,
}: UpdateAppointmentParams) => {
    try {
        // Update appointment to scheduled -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        );

        if (!updatedAppointment) throw Error;

        // const smsMessage = `Greetings from CarePulse. ${type === "schedule" ? `Your appointment is confirmed for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` : `We regret to inform that your appointment for ${formatDateTime(appointment.schedule!).dateTime} is cancelled. Reason:  ${appointment.cancellationReason}`}.`;
        // await sendSMSNotification(userId, smsMessage);

        revalidatePath("/admin");

        return parseStringify(updatedAppointment);
        
    } catch (error) {
        console.error("An error occurred while scheduling an appointment:", error);
    }
};
