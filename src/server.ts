import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import controllerPresentation from "./controllers/presentation";
import ControllerUser from "./controllers/user";
import { Prisma } from "@prisma/client";

const secret = process.env.SECRET;

const app = express();

app.use(express.json());
app.use(cors());

//personal index presentation (see my presentations and create new)
app
  .route("/profile/:idprofile/presentations")
  .get(async (req, res) => {
    const idUser = req.params.idprofile;
    const myPresentations = await controllerPresentation.getMyPresentations(
      idUser
    );
    const presentations = await controllerPresentation.getPaticipantsAt(idUser);
    const participantAt = presentations.map((element) => element.presentation);

    res.json({ myPresentations, participantAt });
  })
  //create new
  .post(async (req, res) => {
    const idUser = req.params.idprofile;
    const musicName = req.body.musicName;

    const presentation = await controllerPresentation.postPresentation(
      idUser,
      musicName
    );

    return res.status(201).json(presentation);
  });

//specific presentation (GET (presentation), POST (participant), PUT, DELTE (presentation))
app
  .route("/profile/presentation/:id")
  .get(async (req, res) => {
    const idPresentation = req.params.id;

    const presentation = await ControllerUser.getOnePresentation(
      idPresentation
    );

    res.json(presentation);
  })
  .post(async (req, res) => {
    const idPresentation = req.params.id;
    const ra = req.body.ra;
    const name = req.body.name;

    //add participant or create a new one if it doesn't exist
    try {
      const newParticipant =
        await ControllerUser.postAddParticipantInPresentation(
          ra,
          name,
          idPresentation
        );

      return res
        .status(201)
        .json({ menssage: "usuario foi adicionado", newParticipant });
    } catch {
      res.status(400).json("Erro: participante repetido");
    }
  })
  .delete(async (req, res) => {
    const idPresentation = req.params.id;
    const resp = await ControllerUser.deleteMyPresentation(idPresentation);
    return res.status(200).json({ "Apresentação apagada com suceso": resp });
  })
  .put(async (req, res) => {
    const idPresentation = req.params.id;
    const ra = req.body.ra;

    //add participant or create a new one if it doesn't exist
    try {
      const removeParticipant =
        await ControllerUser.putParticipantInPresentation(ra, idPresentation);

      return res
        .status(201)
        .json({ menssage: "usuario foi removido", removeParticipant });
    } catch {
      res.status(400).json("Erro: participante não existe");
    }
  });

//all presentation
app
  .route("/all/presentation")
  .get(async (req, res) => {
    const presentation = await controllerPresentation.getAllPresentation();

    res.json(presentation);
  })
  .put(async (req, res) => {
    const resp = await controllerPresentation.putOpenAllVote();
    return res.status(200).json(resp);
  });

app
  .route("/all/participants")
  .get(async (req, res) => {
    const participants = await ControllerUser.getAllParticipants();

    res.json(participants);
  })
  .delete(async (req, res) => {
    const resp = await ControllerUser.deleteAllParticipants();
    return res.status(200).json({ "Usuarios deletados com suceso": resp });
  });

app.post("/login", async (req, res) => {
  const userId = req.body.ra;
  const password = req.body.password;
  try {
    const user = await ControllerUser.getLogin(userId, password);
    if (!user) {
      return res.status(401).json("Usuario não existe");
    }
    const token = jwt.sign({ userId }, process.env.SECRET, {
      expiresIn: 300, // expires in 5min
    });
    return res.json({ auth: true, user, token });
  } catch (error) {
    return res.json("ERRO");
  }
});

app.post("/register", async (req, res) => {
  const ra = req.body.ra;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const user = await ControllerUser.postRegister(ra, name, password);
    console.log(user);
    if (!user) {
      return res.status(400).json("ERoo");
    }

    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == "P2002") {
        return res.status(400).json("Esse RA já foi cadastrado");
      }
    }
  }
});

app.post("/grade/:presentationId", async (req, res) => {
  const presentationId = req.params.presentationId;
  const valueString = req.body.value;
  const value = parseInt(valueString);
  await controllerPresentation.postGradePresentation(
    presentationId,
    "a2372452",
    value
  );
  return res.status(200).json("/");
});

app.listen(3333, () => "server running on port 3333");
