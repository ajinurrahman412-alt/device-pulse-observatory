<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the Agent Town's six room IDs, anchors, room tones, and shared room presentation defined centrally so Owner and User views stay consistent; the dashboard design depends on one six-room model.
- The home dashboard is built from live components (shared AgentTown + panels); the reference images are design guidance only, so the screen stays interactive.
- Roles live in the user_roles table and are assigned server-side by the ensure_my_role() function (first account = owner); the UI reads the role from the store and never trusts client-chosen roles.
