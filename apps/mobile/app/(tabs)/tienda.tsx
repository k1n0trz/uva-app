import { EmptyState } from '../../components/ui';
import { TabScreenShell } from '../../components/nav';

export default function TiendaScreen() {
  return (
    <TabScreenShell>
      <EmptyState
        title="Tienda UVA"
        description="Catálogo, ficha de producto y checkout simulado hacia WooCommerce llegan en la Fase 6 del roadmap."
      />
    </TabScreenShell>
  );
}
