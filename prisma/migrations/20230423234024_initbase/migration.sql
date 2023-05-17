-- CreateTable
CREATE TABLE "Listener" (
    "ra" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Participant" (
    "ra" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "musicName" TEXT NOT NULL,
    "openToVote" BOOLEAN NOT NULL,
    "participantRa" TEXT NOT NULL,
    CONSTRAINT "Presentation_participantRa_fkey" FOREIGN KEY ("participantRa") REFERENCES "Participant" ("ra") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParticipantAt" (
    "participantRa" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,

    PRIMARY KEY ("participantRa", "presentationId"),
    CONSTRAINT "ParticipantAt_participantRa_fkey" FOREIGN KEY ("participantRa") REFERENCES "Participant" ("ra") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParticipantAt_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListenerAt" (
    "listenerRa" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,

    PRIMARY KEY ("listenerRa", "presentation"),
    CONSTRAINT "ListenerAt_listenerRa_fkey" FOREIGN KEY ("listenerRa") REFERENCES "Listener" ("ra") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ListenerAt_presentation_fkey" FOREIGN KEY ("presentation") REFERENCES "Presentation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL,
    "listenerRa" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,
    CONSTRAINT "Grade_listenerRa_fkey" FOREIGN KEY ("listenerRa") REFERENCES "Listener" ("ra") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grade_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
