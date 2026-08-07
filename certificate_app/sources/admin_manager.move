module certificate_app::admin_manager {
    // Import Datatypes
    use sui::table::{Self, Table};
    use std::string::{String};

    /// The Master Key - Only one exists, given to the publisher.
    public struct AdminCap has key { id: UID }
    /// The Staff Key - Issued by the Admin to Universities.
    public struct InstitutionCap has key { id: UID }

    /// This struct holds the specific details for each institution
    public struct UniversityProfile has store {
        name: String,
        location: String,
        url: String,
        is_active: bool
    }
    /// The Shared Registry - Anyone can read this, only Admin can write.
    public struct TrustedRegistry has key {
        id: UID,
        list: Table<address, UniversityProfile> // Maps wallet address to "is_trusted" status
    }
    
    /// This runs once when you publish the contract.
    fun init(ctx: &mut TxContext) {
        // The person who deploys the code becomes the Admin
        let admin_cap = AdminCap { id: object::new(ctx) };
        transfer::transfer(admin_cap, tx_context::sender(ctx));

        // Create the Shared Registry and make it public
        let registry = TrustedRegistry {
            id: object::new(ctx),
            list: table::new(ctx)
        };
        transfer::share_object(registry);
    }
    /// Only the holder of AdminCap can call this to "enroll" an institution.
    public fun authorise_institution(
        _: &AdminCap,
        registry: &mut TrustedRegistry,
        target: address,
        name: String,
        location: String,
        url: String,
        ctx: &mut TxContext
    ){
        let profile = UniversityProfile {
            name,
            location,
            url,
            is_active: true
        };

        table::add(&mut registry.list, target, profile);

        let inst_cap = InstitutionCap { id: object::new(ctx) };
        transfer::transfer(inst_cap, target);
    }
}