import { EmptyState } from '../../components/ui';
import { TabScreenShell } from '../../components/nav';

export default function CalendarioScreen() {
  return (
    <TabScreenShell>
      <EmptyState
        title="Calendario menstrual"
        description="Vista mensual, historial de ciclos y predicción básica llegan en la Fase 3 del roadmap."
      />
    </TabScreenShell>
  );
}
