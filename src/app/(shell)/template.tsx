/**
 * Route transition: the incoming screen fades in over 180ms, opacity only.
 * Nothing moves, and the sidebar (in layout, above this template) stays put.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="au-route flex w-full grow flex-col items-center">{children}</div>;
}
