import {
  createSensor,
  deleteSensor,
  getSensorById,
  getSensors,
  updateSensor
} from "@/controllers/sensor.controller"
import { errorHandler } from "@/utils/errorHandler"
import { Router } from "express"

const sensorRoutes = Router()

sensorRoutes.post("/", errorHandler(createSensor))
sensorRoutes.get("/", errorHandler(getSensors))
sensorRoutes.get("/:id", errorHandler(getSensorById))
sensorRoutes.patch("/:id", errorHandler(updateSensor))
sensorRoutes.delete("/:id", errorHandler(deleteSensor))

export { sensorRoutes }

