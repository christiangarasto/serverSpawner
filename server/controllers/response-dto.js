const { StatusCodes } = require("http-status-codes");

const dataSuccess = (data) => {
  let count;

  if (Array.isArray(data)) {
    count = data.length;
  } else if (data) {
    count = 1;
  } else {
    count = 0;
  }

  return { success: true, body: { data, count } };
};

const dataError = (err) => {
  return { success: false, msg: err.message };
};

const createdDto = (res, data) => {
  res.status(StatusCodes.CREATED).json(dataSuccess(data));
};

const okDto = (res, data) => {
  res.status(StatusCodes.OK).json(dataSuccess(data));
};

const errorCustomDto = (res, err) => {
  return res.status(err.statusCode).json(dataError(err));
};

const errorGenericDto = (res, err) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(dataError(err));
};

module.exports = {
  createdDto,
  okDto,
  errorCustomDto,
  errorGenericDto,
};
