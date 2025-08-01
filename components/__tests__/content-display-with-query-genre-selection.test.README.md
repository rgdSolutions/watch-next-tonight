# Content Display With Query - Genre Selection Tests

This test file provides comprehensive coverage for the `chooseInitialContentType` functionality added to the ContentDisplayWithQuery component.

## What's Being Tested

The test suite covers the automatic content type selection based on genre preferences:

### 1. Priority-Based Genre Selection

The component automatically selects the initial content type (All, Movies, or TV Shows) based on genre priorities:

1. **Highest Priority - Massively Popular TV-Only Genres**:
   - `kids` → TV Shows
   - `reality` → TV Shows

2. **Second Priority - Highly Popular Movie-Only Genres**:
   - `horror` → Movies
   - `romance` → Movies

3. **Third Priority - TV-Only Genres**:
   - `news` → TV Shows
   - `soap` → TV Shows
   - `talk` → TV Shows

4. **Fourth Priority - Movie-Only Genres**:
   - `history` → Movies
   - `music` → Movies
   - `mystery` → Movies

5. **Default - Genres Available on Both Platforms**:
   - `comedy`, `drama`, etc. → All Content

### 2. Test Categories

- **Priority Testing**: Ensures each genre correctly triggers its expected content type
- **Priority Override Testing**: Verifies higher priority genres override lower ones
- **Edge Cases**: Tests empty genres, unknown genres, and mixed-case handling
- **Complex Combinations**: Tests multiple genres with different priorities
- **Integration**: Verifies correct content is displayed based on the auto-selected type

## Test Structure

Each test follows this pattern:

1. Render component with specific genre preferences
2. Find the content type dropdown (first combobox)
3. Verify it shows the expected content type

## Key Implementation Details

- The component uses a dropdown select (combobox) for content type selection
- The initial content type is determined only on component mount
- Manual selection by the user overrides the automatic selection
- The function handles genre IDs in lowercase for consistency

## Total Test Coverage

- 25 tests covering all priority levels and edge cases
- Tests ensure the feature works correctly for all genre combinations
- Integration tests verify the feature works with the rest of the component
