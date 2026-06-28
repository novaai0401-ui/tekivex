Forms are where most accessibility regressions slip into production. They are also where the cost of getting it wrong is highest: a checkout, a sign-up, a settings panel, or a benefits enrollment screen that a keyboard or screen reader user cannot complete is not a cosmetic bug, it is a blocked transaction. The hard part is that accessible forms require dozens of small, correct relationships, label-to-input associations, error announcements, focus order, ARIA state, all wired consistently across every field in an application. Hand-rolling that wiring per project is how teams end up with inconsistent, half-compliant forms.

The Tekivex UI form toolkit exists to make the correct version the default. It is part of `tekivex-ui`, our free-to-use component library for React 18+, Vue 3, and Svelte 5, and it ships the same accessible components, `TkxAutoForm`, `TkxInput`, `TkxSelect`, `TkxCheckbox`, and `TkxAutocomplete`, across all three frameworks. The components are tree-shakeable ESM with zero runtime dependencies, so you inherit the accessibility behavior without inheriting a bundle penalty (the core bundle sits under 8 kB). Install with `npm install tekivex-ui` and pull in the stylesheet once with `import 'tekivex-ui/styles'`.

This article walks through how the toolkit handles label association, error states, ARIA wiring, focus management, validation, and field groups, and then maps each of those behaviors to the WCAG 2.1 AA success criteria they satisfy. Tekivex UI targets WCAG 2.1 AA across its components and is built toward AAA (a third-party AAA audit is on the roadmap, not yet completed). The code examples use React for concreteness; the Vue and Svelte APIs mirror them one to one.

## Label and input association

The single most common form accessibility defect is a visible label that is not programmatically associated with its control. A placeholder is not a label, and a `<div>` styled to look like a label tells assistive technology nothing. `TkxInput` solves this by generating a stable, unique ID and binding the rendered label to it, so the control is connected without you managing `htmlFor`/`id` pairs by hand.

```tsx
import { TkxInput } from 'tekivex-ui';
import 'tekivex-ui/styles';

function EmailField() {
  return (
    <TkxInput
      name="email"
      type="email"
      label="Work email"
      autoComplete="email"
      required
      error="Enter a valid company email address."
    />
  );
}
```

`TkxInput` renders a `<label for="…">` bound to the input's generated `id`, sets `aria-required="true"` on the input because `required` was passed, and assigns the error element an ID that the input references through `aria-describedby` only when an error is present. Clicking the label focuses the input, and a screen reader announces "Work email, required, edit text." No manual ID bookkeeping, and no chance of two fields colliding on the same ID even when the component is rendered in a list.

## Error states and status messages

An error message that appears visually but is never announced fails real users. The toolkit treats errors as first-class state. When a field is invalid, `TkxInput` receives `aria-invalid="true"`, its `aria-describedby` is extended to include the error element, and that element renders with `role="alert"` so the message is announced the moment it appears, without the user having to navigate to it.

Critically, `aria-describedby` points at the error only while the error exists. Pointing it at an empty or hidden node is a frequent mistake that produces silence or stale announcements. The toolkit adds and removes the association in lockstep with the error state, so the accessible description always matches what is on screen.

For form-level status, such as "3 fields need attention" after a failed submit, pair the toolkit with a live region:

```tsx
<div role="status" aria-live="polite">
  {summary && `${summary.count} fields need attention.`}
</div>
```

`role="alert"` is assertive and interrupts; `role="status"` / `aria-live="polite"` waits for a pause. Use alert for individual field errors that block progress and status for non-urgent summaries.

## Validation, focus management, and the submit flow

The toolkit's `TkxAutoForm` component coordinates validation and focus. You supply a validate function returning a map of field names to error messages; on submit, `TkxAutoForm` runs it, distributes messages to the matching fields, and, if any field is invalid, moves focus to the first invalid control in DOM order. Focusing the first error is what makes a failed submit recoverable for keyboard and screen reader users, instead of leaving focus on a submit button while errors appear silently above.

### Uncontrolled (native) pattern

Uncontrolled fields read values from the DOM at submit time. This is the lightest-weight option and works well for simple forms.

```tsx
import { TkxAutoForm, TkxInput } from 'tekivex-ui';

function SignupForm() {
  function validate(values: Record<string, string>) {
    const errors: Record<string, string> = {};
    if (!values.email?.includes('@')) errors.email = 'Enter a valid email.';
    if ((values.password ?? '').length < 12)
      errors.password = 'Password must be at least 12 characters.';
    return errors;
  }

  return (
    <TkxAutoForm validate={validate} onValidSubmit={(values) => api.signup(values)}>
      <TkxInput name="email" type="email" label="Email" autoComplete="email" required />
      <TkxInput
        name="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        required
      />

      <button type="submit">Create account</button>
    </TkxAutoForm>
  );
}
```

`onValidSubmit` only fires when `validate` returns no errors. Each `TkxInput` shows no error text until the matching error key is present, then announces it. Focus jumps to whichever field failed first.

### Controlled pattern

When you need live validation, conditional fields, or external state (a form library, a store), drive each `TkxInput` with a controlled value and validate as the user types. The accessibility wiring is identical; only the data flow changes.

```tsx
import { useState } from 'react';
import { TkxAutoForm, TkxInput } from 'tekivex-ui';

function ProfileForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', country: '' });
  const errors = {
    firstName: form.firstName ? '' : 'First name is required.',
    lastName: form.lastName ? '' : 'Last name is required.',
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <TkxAutoForm errors={errors} onValidSubmit={() => api.saveProfile(form)}>
      <fieldset>
        <legend>Legal name</legend>
        <TkxInput
          name="firstName"
          label="First name"
          value={form.firstName}
          onChange={set('firstName')}
          required
        />
        <TkxInput
          name="lastName"
          label="Last name"
          value={form.lastName}
          onChange={set('lastName')}
          required
        />
      </fieldset>

      <button type="submit">Save</button>
    </TkxAutoForm>
  );
}
```

When you pass `errors` directly, `TkxAutoForm` treats validity as derived state and still performs focus-on-error at submit. Controlled and uncontrolled fields can be mixed in the same form.

## Field groups: fieldset and legend

Related controls, a name split across two inputs, a set of radio options, a billing address, need a group label so assistive technology can announce the shared context. A native `<fieldset>` with a `<legend>` is what screen readers prepend to each contained control's accessible name. In the example above, the first-name input is announced as "Legal name, First name, required." This is the only reliable way to convey that a single label governs multiple inputs, and it is far more robust than an `aria-label` heuristic.

For radio and checkbox sets, `TkxCheckbox` and the grouped selection controls coordinate a shared `name` and roving focus so arrow keys move between options as the platform expects.

## WCAG 2.1 AA coverage

The form toolkit is designed against specific success criteria rather than a vague "a11y" goal. The table below maps the relevant Level A/AA criteria to the mechanism that satisfies each.

| WCAG 2.1 criterion | Level | How the form toolkit satisfies it |
| --- | --- | --- |
| 1.3.1 Info and Relationships | A | `TkxInput` programmatically links its label to the control via `for`/`id`; grouped controls use `fieldset`/`legend`. |
| 3.3.1 Error Identification | A | Invalid fields set `aria-invalid` and render error text that names the specific problem in the relevant field. |
| 3.3.2 Labels or Instructions | A | Every `TkxInput` requires a `label`; `aria-required` and instructional error text describe expectations. |
| 3.3.3 Error Suggestion | AA | Error messages carry corrective guidance (e.g. minimum length) rather than a bare "invalid". |
| 4.1.2 Name, Role, Value | A | Native elements plus correct ARIA expose accessible name, role, and current invalid/required state. |
| 4.1.3 Status Messages | AA | Field errors use `role="alert"`; form summaries use `role="status"`/`aria-live` so changes announce without focus moves. |
| 2.4.3 Focus Order | A | Submit-time focus moves to the first invalid control in DOM order, preserving a logical recovery path. |

Meeting these criteria still depends on the content you supply, write specific error text and real labels, but the toolkit removes the structural failure modes that no amount of good copy can fix.

## Key takeaways

Reach for the Tekivex UI form toolkit when you want WCAG 2.1 AA form behavior to be the default rather than a per-field audit. It is the right fit when you are building forms across React, Vue, or Svelte and want one mental model, when you need both controlled and uncontrolled patterns in the same codebase, and when you want headless primitives you can style to match an existing design system. Because the primitives are unstyled, you bring your own visual language; the toolkit owns only the wiring that is easy to get wrong, label association, ARIA state, error announcement, and focus-on-error.

If you are weighing it against other libraries, the [Tekivex UI vs MUI and Chakra comparison](/use-cases/tekivex-ui-vs-mui-chakra) covers the trade-offs, and the [headless design system guide](/use-cases/tekivex-ui-headless-design-system) explains the unstyled-primitive philosophy — and the CSS-variable theming system, including the high-contrast mode that helps satisfy contrast criteria — in more depth.

Accessible forms are not a feature you bolt on at the end; they are a set of relationships you either maintain consistently or break silently. The form toolkit's value is that consistency, the same correct associations, ARIA, and focus behavior on every field, in every form, on every framework you ship. Explore the full component set on the [Tekivex UI product page](/product/tekivex-ui) or browse more [engineering use cases](/use-cases).
