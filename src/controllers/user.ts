import { dbPrisma } from "../repository/prisma";

export default {
  async postRegister(ra: string, name: string, password: string) {
    return await dbPrisma.participant.create({
      data: {
        ra,
        name,
        password,
      },
    });
  },

  async getAllParticipants() {
    return await dbPrisma.participant.findMany({
      select: {
        ra: true,
        name: true,
      },
    });
  },

  async deleteAllParticipants() {
    const deleteGrade = dbPrisma.grade.deleteMany({});
    const deleteListenerAt = dbPrisma.listenerAt.deleteMany({});
    const deleteListener = dbPrisma.listener.deleteMany({});
    const deleteParticipant = dbPrisma.participantAt.deleteMany({});
    const deleteParticipantAt = dbPrisma.participant.deleteMany({});
    const deletePresentation = dbPrisma.presentation.deleteMany({});

    await dbPrisma.$transaction([
      deleteGrade,
      deleteListenerAt,
      deleteListener,
      deleteParticipant,
      deletePresentation,
      deleteParticipantAt,
    ]);
  },

  async getLogin(user: string, password: string) {
    return await dbPrisma.participant.findFirst({
      select: {
        name: true,
        ra: true,
      },
      where: {
        ra: user,
        password,
      },
    });
  },

  async getOnePresentation(presentationId: string) {
    return await dbPrisma.presentation.findFirst({
      select: {
        id: true,
        musicName: true,
        openToVote: true,
        participantRa: true,
        _count: {
          select: {
            Participants: true,
          },
        },
        Participants: {
          select: {
            participant: {
              select: {
                ra: true,
                name: true,
              },
            },
          },
        },
      },
      where: {
        id: presentationId,
      },
    });
  },

  //add participant or create a new one if it doesn't exist
  async postAddParticipantInPresentation(
    userId: string,
    nameParticipant: string,
    presentationId: string
  ) {
    return await dbPrisma.participant.upsert({
      where: {
        ra: userId,
      },
      update: {
        ParticipantAt: {
          create: {
            presentationId,
          },
        },
      },
      create: {
        ra: userId,
        name: nameParticipant,
        ParticipantAt: {
          create: {
            presentationId,
          },
        },
      },
    });
  },

  async putParticipantInPresentation(userId: string, presentationId: string) {
    return await dbPrisma.participantAt.delete({
      where: {
        participantRa_presentationId: {
          participantRa: userId,
          presentationId,
        },
      },
    });
  },

  async deleteMyPresentation(presentationId: string) {
    const presentation = await dbPrisma.presentation.findUnique({
      where: {
        id: presentationId,
      },
    });

    await dbPrisma.grade.deleteMany({
      where: {
        presentationId,
      },
    });

    // Remova as associações com os ouvintes
    await dbPrisma.listenerAt.deleteMany({
      where: {
        presentation: presentationId,
      },
    });

    // Remova as associações com os participantes
    await dbPrisma.participantAt.deleteMany({
      where: {
        presentationId,
      },
    });

    // Remova a apresentação
    await dbPrisma.presentation.delete({
      where: {
        id: presentationId,
      },
    });

    return presentation;
  },
};
