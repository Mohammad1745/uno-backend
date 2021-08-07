class ResponseService {
    constructor() {
    }
    #response = {
        success : null,
        message : '',
        data : null
    }
    #errorMessage = 'Something went wrong! ';

    response (data=null) {
        this.#response['data'] = data;
        return this;
    }

    success (message=null) {
        this.#response['success'] = true;
        this.#response['message'] = message ?
            message :
            'Done';
        return this.#response;
    }

    error (message=null) {
        this.#response['success'] = false;
        this.#response['message'] = message ?
            message :
            this.#errorMessage;
        return this.#response;
    }
}

module.exports = ResponseService