module blockchain_modules::create_certificate{
    // Import Datatypes
    use std::string::{String};
    use blockchain_modules::admin_manager::{InstitutionCap};

    /// Define structure of certificate object - has key but no 
    public struct Certificate has key{
        id: UID,
        name: String,
        qualification: String,
        grade: String,
        university: String,
        issued_by: address
    }

    /// Function that takes credentials and wallet addresses, creates and assigns a certificate
    public fun create_certificate(
        _cap: &InstitutionCap,
        student: address,
        name: String, 
        qualification: String,
        grade: String,
        university: String,
        ctx: &mut TxContext
    ){
        // Create a certificate object
        let certificate = Certificate {
            id: object::new(ctx),
            name,
            qualification,
            grade,
            university,
            issued_by: tx_context::sender(ctx)
        };  
        // Transfer certificate object to the student wallet
        transfer::transfer(certificate, student);
    }
}
