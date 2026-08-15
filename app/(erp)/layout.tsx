import Shell from '@/components/shell'; import { requireSession } from '@/lib/auth';
export default async function ErpLayout({children}:{children:React.ReactNode}){await requireSession();return <Shell>{children}</Shell>}
