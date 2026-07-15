import { EmptyState } from '../../components/ui';
import { TabScreenShell } from '../../components/nav';

export default function RutinasScreen() {
  return (
    <TabScreenShell>
      <EmptyState
        title="Rutinas y piso pélvico"
        description="Rutinas generales, evaluación e intake de Bolas Kegel UVA llegan en la Fase 5 del roadmap."
      />
    </TabScreenShell>
  );
}
