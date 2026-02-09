# Level Solutions for Firebase

## Format for Firebase Storage

Store solutions in Firebase `settings/levels` document. Each level should have a `solution` field containing an array of `CommandWithArgType` objects.

## Solution Format

Each solution is an array of command objects. Here's the structure:

```typescript
{
  command: CommandType;  // e.g., "INPUT", "OUTPUT", "COPYFROM", etc.
  arg?: number | CommandWithArgType;  // Optional argument (slot index 0-based, or JUMP target)
  message?: string;     // Optional: short hint shown next to the step in the solution popup
  from?: number;        // Optional: slot index (1-based) for COPYFROM/COPYTO/ADD/SUB; only displayed when set
  step?: number;        // Optional: JUMP target step number (1-based); only displayed when set
}
```
If `from` or `step` is not set in the JSON, it is not shown in the solution popup. Example: `{"command":"COPYFROM", "from": 1}` shows as "COPYFROM 1"; `{"command":"OUTPUT"}` shows as "OUTPUT" with no number.

### Special Cases:

1. **Commands with slot indices** (COPYFROM, COPYTO, ADD, SUB):
   - Use numeric `arg` (0, 1, 2, etc.) for construction slot index
   - Example: `{ "command": "COPYFROM", "arg": 0 }`

2. **JUMP commands**:
   - Use `{ "command": "" }` as placeholder for label reference
   - The system will resolve these when loading
   - Example: `{ "command": "JUMP", "arg": { "command": "" } }`

## Complete Solutions Array

Here are all level solutions ready for Firebase:

### Level 1 - Supply Chamber
```json
[
  {"command": "INPUT"},
  {"command": "OUTPUT"},
  {"command": "INPUT"},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 2 - Busy Supply Chamber
```json
[
  {"command": "INPUT"},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 3 - Replica Slate
```json
[
  {"command": "COPYFROM", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "COPYFROM", "arg": 1},
  {"command": "OUTPUT"},
  {"command": "COPYFROM", "arg": 2},
  {"command": "OUTPUT"}
]
```

### Level 4 - Scrambler Handler
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "INPUT"},
  {"command": "OUTPUT"},
  {"command": "COPYFROM", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 5 - Replica Slate (Add pairs)
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "INPUT"},
  {"command": "ADD", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 6 - Tripler Room
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "ADD", "arg": 0},
  {"command": "ADD", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 7 - Octoplier Suite
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "ADD", "arg": 0},
  {"command": "COPYTO", "arg": 1},
  {"command": "ADD", "arg": 1},
  {"command": "COPYTO", "arg": 2},
  {"command": "ADD", "arg": 2},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 8 - Zero Exterminator
```json
[
  {"command": "INPUT"},
  {"command": "JUMP = 0", "arg": {"command": ""}},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 9 - Zero Preservation
```json
[
  {"command": "INPUT"},
  {"command": "JUMP = 0", "arg": {"command": ""}},
  {"command": "JUMP", "arg": {"command": ""}},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 10 - Sub Hallway
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 1},
  {"command": "SUB", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "COPYFROM", "arg": 0},
  {"command": "SUB", "arg": 1},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 11 - Equalization Room
```json
[
  {"command": "INPUT"},
  {"command": "COPYTO", "arg": 0},
  {"command": "INPUT"},
  {"command": "SUB", "arg": 0},
  {"command": "JUMP = 0", "arg": {"command": ""}},
  {"command": "JUMP", "arg": {"command": ""}},
  {"command": "COPYFROM", "arg": 0},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

### Level 12 - Zero Exterminator (duplicate of Level 8)
```json
[
  {"command": "INPUT"},
  {"command": "JUMP = 0", "arg": {"command": ""}},
  {"command": "OUTPUT"},
  {"command": "JUMP", "arg": {"command": ""}}
]
```

## How to Add to Firebase

1. Open Firebase Console
2. Navigate to Firestore Database
3. Go to `settings` collection → `levels` document
4. For each level in the `levels` array, add a `solution` field with the corresponding solution array above

## Important Notes

- **Slot Indices**: COPYFROM, COPYTO, ADD, SUB use 0-based indices for construction slots
- **JUMP Labels**: The `{"command": ""}` placeholder will be resolved by the system when loading
- **Loop Structure**: Most levels end with a JUMP command that loops back to the beginning
- **Conditional Jumps**: JUMP = 0 commands skip the next instruction if value is zero

