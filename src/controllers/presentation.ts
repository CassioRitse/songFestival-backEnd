import { dbPrisma } from "../repository/prisma";

export default {
  async getMyPresentations(idUser: string) {
    return await dbPrisma.presentation.findMany({
      select: {
        id: true,
        musicName: true,
        participantRa: true,
        openToVote: true,
        _count: {
          select: {
            Participants: true,
          },
        },
      },
      where: {
        participantRa: idUser,
      },
    });
  },

  async getPaticipantsAt(idUser: string) {
    return await dbPrisma.participantAt.findMany({
      select: {
        presentation: {
          select: {
            id: true,
            musicName: true,
            participantRa: true,
            _count: {
              select: {
                Participants: true,
              },
            },
          },
        },
      },
      where: {
        participantRa: idUser,
        NOT: {
          presentation: {
            participantRa: idUser,
          },
        },
      },
    });
  },

  async postPresentation(idUser: string, musicName: string) {
    return await dbPrisma.presentation.create({
      data: {
        musicName: musicName,
        participantRa: idUser,
        openToVote: false,
        Participants: {
          create: {
            participantRa: idUser,
          },
        },
      },
    });
  },

  async getAllPresentation() {
    return await dbPrisma.presentation.findMany({
      select: {
        id: true,
        musicName: true,
        openToVote: true,
        Grade: {
          select: {
            value: true,
          },
        },
        Participants: {
          select: {
            participant: {
              select: {
                name: true,
                ra: true,
              },
            },
          },
        },
        _count: {
          select: {
            Participants: true,
          },
        },
      },
    });
  },

  async putOpenAllVote() {
    const { openToVote } = await dbPrisma.presentation.findFirst({
      select: {
        openToVote: true,
      },
    });
    await dbPrisma.presentation.updateMany({
      data: {
        openToVote: openToVote ? false : true,
      },
    });

    return openToVote;
  },

  async postGradePresentation(
    presentationId: string,
    listenerRa: string,
    value: number
  ) {
    await dbPrisma.listener.upsert({
      where: {
        ra: listenerRa,
      },
      update: {},
      create: {
        ra: listenerRa,
        name: "Ouvinte",
        password: "ouvinte",
      },
    });

    await dbPrisma.grade.create({
      data: {
        value,
        presentationId,
        listenerRa,
      },
    });
  },
};
