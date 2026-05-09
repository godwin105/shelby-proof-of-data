module proof_of_data_addr::proof_of_data {
    use std::string::String;
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event;
    use aptos_std::table::{Self, Table};

    struct ProofEntry has store, drop, copy {
        file_hash: String,
        timestamp_us: u64,
        owner: address,
    }

    struct ProofStore has key {
        proofs: Table<String, ProofEntry>,
        proof_recorded_events: event::EventHandle<ProofRecordedEvent>,
    }

    struct ProofRecordedEvent has drop, store {
        file_hash: String,
        timestamp_us: u64,
        owner: address,
    }

    const E_STORE_NOT_INITIALIZED: u64 = 1;
    const E_PROOF_ALREADY_EXISTS: u64  = 2;

    public entry fun init_store(account: &signer) {
        move_to(account, ProofStore {
            proofs: table::new(),
            proof_recorded_events: event::new_event_handle<ProofRecordedEvent>(account),
        });
    }

    public entry fun record_proof(account: &signer, file_hash: String) acquires ProofStore {
        let owner = signer::address_of(account);
        assert!(exists<ProofStore>(owner), E_STORE_NOT_INITIALIZED);
        let store = borrow_global_mut<ProofStore>(owner);
        assert!(!table::contains(&store.proofs, file_hash), E_PROOF_ALREADY_EXISTS);
        let ts = timestamp::now_microseconds();
        let entry = ProofEntry { file_hash: copy file_hash, timestamp_us: ts, owner };
        table::add(&mut store.proofs, copy file_hash, entry);
        event::emit_event(&mut store.proof_recorded_events, ProofRecordedEvent {
            file_hash, timestamp_us: ts, owner,
        });
    }

    #[view]
    public fun get_proof(owner: address, file_hash: String): (bool, u64) acquires ProofStore {
        if (!exists<ProofStore>(owner)) { return (false, 0) };
        let store = borrow_global<ProofStore>(owner);
        if (!table::contains(&store.proofs, file_hash)) { return (false, 0) };
        let entry = table::borrow(&store.proofs, file_hash);
        (true, entry.timestamp_us)
    }
}
