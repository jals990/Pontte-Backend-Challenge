import Log from '../models/Log';

async function createLog(UUID, description){
  await Log.create({
    id_request: UUID,
    description: description
  });
}

export default createLog;
