const errorMiddleware = (err, req, res, next) => {
  console.log(err)
  const defaultError={
    statusCode: 500,
    message: err,
  }
     

};
export default errorMiddleware;
