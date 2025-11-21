
/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: integer
 *         type:
 *           type: string
 *         data:
 *           type: object
 */

const sendResponse = (res, statusCode, message, type ="success" , data =null)=> {
    const response ={
        message,
        code:statusCode,
        type,
    } 
    if (data){
        response.data=data;
    }
    return res.status(statusCode).json(response);
}

export default sendResponse;